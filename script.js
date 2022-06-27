

let mensagens; 
let nome;
let intervaloConexao;
let intervaloAtualizarMensagens;



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


    const promessa = axios.post
    (
        "https://mock-api.driven.com.br/api/v6/uol/participants",
        novoUsuario
    );

    promessa.then((resposta) => {
        if(resposta.status === 200) {
            intervaloConexao = setInterval(manterConexao,5000);
            buscarMensagem();
            intervaloAtualizarMensagens = setInterval(buscarMensagem, 3000); 
        }
    });

    promessa.catch(()=>{ 
        alert("usuário já existente");
        pedirNome();
    })
}

function manterConexao (){ 
    const usuario = 
    {
        name: nome 
    };

    const promessa = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", usuario
    );
    promessa.then(() => console.log('mantendo conexão'));
    promessa.catch(() => clearInterval(intervaloConexao)); 
}

function buscarMensagem(){
    
    const promessa = axios.get(
        "https://mock-api.driven.com.br/api/v6/uol/messages"
    );
      
    promessa.then(exibirMensagens);
    promessa.catch(() => clearInterval(intervaloAtualizarMensagens));
}

function exibirMensagens(resposta) {
    mensagens = resposta.data;
    renderizarMensagem();
    
}


function enviarMensagem(){
    const texto = document.querySelector(".inputEnviarMensagem").value; 
    const novaMensagem = {
        from: nome ,
        to: "Todos" ,
        text: texto ,
        type: "message" ,
    };
    
    const promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem
    );
    
    promise.then(()=> {
        document.querySelector(".inputEnviarMensagem").value = "";
        buscarMensagem();
    });
    promise.catch(() => {
        window.location.reload()
    });
    

}

function renderizarMensagem(){

    let mensagemHtml = "";
    mensagens.forEach((mensagem) => { 
        if(mensagem.type === "status"){
            mensagemHtml += `<div class="envia">
                <p> <span>(${mensagem.time})</span> <strong>${mensagem.from}</strong> ${mensagem.text} </p>
            </div>`  
        }
        else if((mensagem.type === "private_message") && (mensagem.from === nome || mensagem.to === nome)){ 
            mensagemHtml += `<div class="privado"> 
                    <p> <span>(${mensagem.time})</span> <strong>${mensagem.from}</strong>  reservadamente para <strong>${ mensagem.to}:</strong> ${mensagem.text}
                    </div> `
                    
        }
        else if (mensagem.type === "message") {
            mensagemHtml +=  `<div class="recebe">
                <p> <span>(${mensagem.time})</span> <strong>${mensagem.from}</strong> para <strong>${mensagem.to}:</strong> ${mensagem.text}</p>
            </div>`  

        }
    
    });
    document.querySelector(".conversa").innerHTML = mensagemHtml;

    let todasMensagens = document.querySelector(".conversa").querySelectorAll("div");
    
    let ultimaMensagem;
    todasMensagens.forEach((mensagem, index)=> { 
        if(todasMensagens.length - 1 === index){
            ultimaMensagem = mensagem;
        }
    });

    ultimaMensagem.scrollIntoView(); 
}



