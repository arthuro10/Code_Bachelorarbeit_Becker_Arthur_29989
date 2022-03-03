
// GraphQL Expressions
module.exports = {
    createFunc: function (_processData,_createdAt,_processId,_processInkrement) {
        const _processDataString = objToString(_processData);
        const _processInkrementString = objToString(_processInkrement);
        return (`
        mutation {createProcess(prozess: {
          processData : {${_processDataString}}  
          created_at : "${_createdAt}"
          processId : "${_processId}"
          processInkrement : {${_processInkrementString}}
          })
          {id processData created_at processId processInkrement}}
        `)
    },
    readFunc: function (_id) {
        return(`
        query {readProcess(id: ${_id}) {id processData created_at} }
        `)
    },
    readAllFunc: function () {

    },
    updateFunc: function () {

    },
    deleteFunc: function () {

    },
    validateFunc: function (_sender, _receiver) {
        return (`
        mutation {validateEmail(adresses: {
          sender : "${_sender}" 
          receiver : "${_receiver}" 
            }) {sender receiver senderValid receiverValid}
          }
        `)

    },
    sendEmail: function (_sender, _receiver,_text,_subject) {
        return (`
        mutation {sendEmail(emailSet: {
          sender : "${_sender}" 
          receiver : "${_receiver}" 
          text : "${_text}" 
          subject : "${_subject}" 
            }) 
          }
        `)

    },

}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            str += p + ':' + obj[p] + '\n';
        }
    }
    return str;
}