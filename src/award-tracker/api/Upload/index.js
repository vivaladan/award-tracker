var azure = require('azure-storage');

module.exports = async function (context, req) {
    let fileName = req.query.file;
    let rows = CSVToArray(req.body);
    let headers = rows[0];
    let entGen = azure.TableUtilities.entityGenerator;
    let tableSvc = azure.createTableService();

    let data = rows.slice(1);

    var uploaded = 0;
    var errors = [];
    var partitions = {};

    for (let index = 0; index < data.length; index++) {
        const row = data[index];

        const sample = {
            Row: index + 2,
            File: fileName,
            Year: row[0],
            Quarter: row[1],
            Region: row[2],
            Country: row[3],
            Requestor: row[4],
            SiteName: row[5],
            SiteRanking: row[6],
            OrderType: row[7],
            Month: row[8],
            Category: row[9],
            PartDescription: row[10],
            PartNumber: row[11],
            SO: row[12],
            OrderDate: row[13],
            Specialty: row[14],
            Purpose: row[15],
            Action: row[16],
            SampleCost: row[17],
            ShipmentDate: row[18],
            ShipmentStatus: row[19],
            ShipTurnaround: row[20],
            Aging: row[21],
            LaunchDate: row[22],
            CorrectedDate: row[23],
            PublishedMonth: row[24],
            ShippedDate: row[25],
            PublishDate: row[26],
            FollowUp: row[27],
            FollowUp: row[28],
            PublishTurnaround: row[29],
            ReviewUrl: row[30],
            AwardUrl: row[31],
            AwardRank: row[32],
            WinsAnAward: row[33],
            AwardDescription: row[34],
            Licence: row[35],
            Quote: row[36],
            Rating: row[37],
            EstimatedViews: row[38],
            YouTubeViews: row[39],
            Likes: row[40],
            Followers: row[41],
            VideoContent: row[42],
        }

        if (!sample.PartNumber) {
            // errors.push({
            //     row: sample.Row,
            //     error: 'Missing Part Number',
            // })
            continue;
        }

        const entity = {
            PartitionKey: entGen.String(encodeURIComponent(sample.PartNumber)),
            RowKey: entGen.String(`${encodeURIComponent(fileName)}_${index + 2}`),
        }

        for (const property in sample) {
            entity[property] = entGen.String(sample[property]);
        }

        let partition = partitions[sample.PartNumber];
        if (!partition) {
            partitions[sample.PartNumber] = [entity];
        }
        else {
            partition.push(entity);
        }
    }

    for (const key in partitions) {
        if (partitions.hasOwnProperty(key)) {
            const partition = partitions[key];

            var i, j, batchItems, batchLength = 100;
            for (i = 0, j = partition.length; i < j; i += batchLength) {
                batchItems = partition.slice(i, i + batchLength);

                let batch = new azure.TableBatch();

                for (let index = 0; index < batchItems.length; index++) {
                    const batchItem = batchItems[index];
                    batch.insertOrReplaceEntity(batchItem, { echoContent: false });
                }

                try {
                    await executeBatch(tableSvc, 'samples', batch);
                    uploaded += partition.length;
                } catch (error) {
                    errors.push({
                        error: error.message,
                    });
                }
            }
        }
    }
    // try {
    //     var response = await insert(tableSvc, 'samples', entity);
    //     uploaded++;
    // } catch (error) {
    //     errors.push({
    //         row: sample.Row,
    //         error: error.message,
    //     });
    // }

    context.res = {
        body: {
            inserted: uploaded,
            errored: errors.length,
            errors,
        }
    }

    context.done();
}

function executeBatch(tableSvc, tableName, batch) {
    return new Promise(
        (resolve, reject) => {
            tableSvc.executeBatch(tableName, batch, function (error, result, response) {
                if (!error) {
                    resolve();
                }
                else {
                    reject(error);
                }
            });
        }
    );
}

function insert(tableSvc, tableName, entity) {
    return new Promise(
        (resolve, reject) => {
            tableSvc.insertOrReplaceEntity(tableName, entity, function (error, result, response) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ result, response });
                }
            });
        }
    )
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}