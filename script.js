// pf

let mensagens; 
let nome;
let intervaloConexao;



function pedirNome(){
nome = prompt('insira o nome')
enviarparticipante()
}
pedirNome();

function enviarparticipante(){

    const novoUsuario = 
    {
         name: nome

    };

    console.log(novoUsuario);

    const promessa = axios.post
    (
         "https://mock-api.driven.com.br/api/v6/uol/participants",
        novoUsuario
    );
    promessa.then(confirmarNome)

} 

function verificarUsuario (){
    console.log('intervalooo')
    const novoUsuario = 
    {
         name: nome

    };

    const promessa = axios.post(
                "https://mock-api.driven.com.br/api/v6/uol/status", novoUsuario
            );
            promessa.then(() => console.log('mantendo conexão'));
            promessa.catch(clearInterval(intervaloConexao));
}

function confirmarNome(resposta){
    console.log("entrou pra confirmar nome")
    if(resposta.status === 200) 
    {
        console.log("tudo certo")
        console.log(nome)

        buscarMensagem();
    }
    else
    {
        alert("usuário já existente");
        pedirNome();
    }
}

function buscarMensagem(){
    const promessa = axios.get(
        "https://mock-api.driven.com.br/api/v6/uol/messages"
      );
      
      promessa.then(exibirMensagens);
    }

function exibirMensagens(resposta) {
    mensagens = resposta.data;
    console.log(mensagens)
   // enviarMensagem();
    renderizarMensagem();
}
/*setTimeout(() => { 
    enviarMensagem();
}, 10000);  */

function enviarMensagem(){
    const texto = document.querySelector(".inputEnviarMensagem").value; 
    console.log(texto);
    const novaMensagem = {
        from: nome ,
        to: "Todos" ,
        text: texto ,
        type: "message" ,
    };
    console.log(novaMensagem, "aqui to aqui");

    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem
    );
    
    promise.then(buscarMensagem);
    promise.catch(() => {
        window.location.reload()
    });
    

}

function renderizarMensagem(){
    let mensagemHtml = "";
    mensagens.forEach(mensagem => { 
        if(mensagem.type === "status"){
            mensagemHtml += `<div class="envia">
                <p> <h2>(${mensagem.time})</h2> <strong>${mensagem.from}</strong>       ${mensagem.text} </p>
            </div>`  
        }
        else if((mensagem.type === "private_message") && (mensagem.from === nome || mensagem.to === nome)){ 
            mensagemHtml += `<div class="privado"> 
                    <p><h2>(${mensagem.time})</h2> <strong>${mensagem.from}</strong>  reservadamente para <strong>${ mensagem.to}</strong>: ${mensagem.text}
                    </div> `
                    
        }
        else if (mensagem.type === "message") {
            mensagemHtml +=  `<div class="recebe">
                <p><h2>(${mensagem.time})</h2> <strong>${mensagem.from}</strong> para <strong>${mensagem.to}</strong>: ${mensagem.text}</p>
            </div>`  

        }
    
    });


    document.querySelector(" .conversa").innerHTML = mensagemHtml;
}


/* function renderizarNome(){
        const usuario = document.querySelector(".usuario")
            usuario.innerHTML+="";
            usuario.innerHTML+= `<div class="usuario">${nome}.name </div> `
    
} */
