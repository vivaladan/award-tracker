var azure = require('azure-storage');

module.exports = async function (context, req) {
    let fileName = req.query.file;
    let rows = CSVToArray(req.body);
    let headers = rows[0];
    let entGen = azure.TableUtilities.entityGenerator;
    let tableSvc = azure.createTableService();
    let batch = new azure.TableBatch();
    let data = rows.slice(1);

    var inserted = 0;
    var errors = [];

    for (let index = 0; index < data.length; index++) {
        const row = data[index];

        const sample = {
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
        }

        const entity = {
            PartitionKey: entGen.String(sample.PartNumber),
            RowKey: entGen.String(`${fileName}_${index + 2}`),
        }

        for (const property in sample) {
            entity[property] = entGen.String(sample[property]);
        }

        try {
            var response = await insert(tableSvc, 'samples', entity);
            inserted++;
        } catch (error) {
            errors.push({
                row: entity.RowKey._,
                error
            });
        }
    }

    context.res = {
        body: {
            inserted,
            errored: errors.length,
            errors,
        }
    }

    context.done();
}

function buildEntity(entGen, row, index, headers, fileName) {
    let partNumber = row[11];

    return {
        PartitionKey: entGen.String(partNumber),
        RowKey: entGen.String(`${fileName}_${index + 2}`),

        Quarter: entGen.String(row[0]),
        Region: entGen.String(row[1]),
        Country: entGen.String(row[2]),
        Requestor: entGen.String(row[3]),
        SiteName: entGen.String(row[4]),
        SiteRanking: entGen.String(row[5]),
        OrderType: entGen.String(row[6]),
        Month: entGen.String(row[7]),
        Category: entGen.String(row[8]),
        PartDescription: entGen.String(row[9]),
    };

    // var entity = {
    //     RowKey: entGen.String(`${fileName}_${index + 2}`),
    // };

    // headers.forEach((header, index) => {
    //     entity[header] = entGen.String(row[index]);
    // });

    // var partNumber = entity["Part Number"]._;
    // entity.PartitionKey = entGen.String(partNumber);

    // return entity;
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