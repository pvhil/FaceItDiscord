const pgclient = require("pg").Client

const syncQuery = (query, values = []) => new Promise((resolve, reject) => {
  pgclient.query(query, values, (err, res) => resolve(res))
    .catch(error => reject("error"))
})

module.exports = {
  syncQuery
}