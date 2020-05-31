var azure = require('azure-storage');

module.exports = async function (context, req) {
    let tableSvc = azure.createTableService();
    var tableQuery = new azure.TableQuery().top(5);

    if (req.query.partNumber) {
        tableQuery = tableQuery.where('PartitionKey eq ?', encodeURIComponent(req.query.partNumber));
    }

    try {
        let response = await executeQuery(tableSvc, 'samples', tableQuery);
        let parts = response.entries.map(c => ({
            PartNumber: c.PartNumber._,
            PartDescription: c.PartDescription._,
            Category: c.Category._,
            Region: c.Region._,
            Country: c.Country._,
            Year: c.Year._,
        }));
        context.res = {
            body: {
                parts,
            }
        }
    } catch (error) {
        context.res = {
            body: {
                error,
            }
        }
    }

    context.done();
}

function executeQuery(tableSvc, tableName, tableQuery) {
    return new Promise(
        (resolve, reject) => {
            tableSvc.queryEntities(tableName, tableQuery, null, function (error, result, response) {
                if (!error) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            })
        }
    )
}