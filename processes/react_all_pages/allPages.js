const axios = require('axios').default;
const _modules = [];

/*
async function loadData() {
    const _query = `query {loadPagesAndProcessesString}`
    const data = await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
        query: _query
        }
  })
  console.log(data.data.data.loadPagesAndProcessesString);
  const parsedData = JSON.parse(data.data.data.loadPagesAndProcessesString);
  console.log(parsedData);
  return parsedData;

}

let parsedData = [];

try {
    (async () => {
        parsedData = await loadData();
        console.log("parsedData")
        console.log(parsedData)
        parsedData.forEach(item => {
        item.pages.forEach(page => {
        const requirePage = require(`../../processes/${item.name}/pages/${page}`);
        console.log("requirePage")
        console.log(requirePage)
        _modules.push(requirePage);
        });
        
});

    })()
} catch (error) {
    console.log("error",error);
}
*/

module.exports = _modules;


                  
                

            


