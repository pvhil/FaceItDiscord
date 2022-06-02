const { default: axios } = require("axios")

const defaultQuery = (url, version = 4) => new Promise((resolve, reject) => {
  axios.get(url, version !== 4 ? {} : {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${process.env.FACEITTOKEN}`
    }
  })
    .then((response) => resolve(response.data))
    .catch((error) => {
      reject('error')
      console.log(error.message, url)
    })
})

module.exports = {
  defaultQuery,
}