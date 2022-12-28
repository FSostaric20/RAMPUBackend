
const { json } = require("body-parser");
const express = require("express");
const mjernajedinicaDAO = require("./DAO/mjernajedinicaDAO");
const namirnicaDAO = require("./DAO/namirnicaDAO");
const namirnicareceptaDAO = require("./DAO/namirnicareceptaDAO.js");
const receptDAO = require("./DAO/receptDAO");
const server = express();
const data = require("./data.json")
let port = process.env.PORT || 3000;
pokreniServer();

function pokreniServer() {
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    pripremiPutanje(); 
    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = { greska: "Nema resursa!" }
        odgovor.json(poruka);
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}



function pripremiPutanje(){
    server.get("/",(zahtjev,odgovor)=>{
        odgovor.send("bokić")
    })
   server.get("/recepti",getRecepti)
   server.get("/namirnice",getNamirnice)
   server.get("/namirnica/:naziv",getNamirnica)
   server.get("/mjernejedinice",getMjerneJedinice)
   server.get("/mjernejedinice/:id",getMjernaJedinica)
   server.get("/namirnicerecepta/recepti/:id",getRecepteNamirnice)
   server.get("/namirnicerecepta/namirnice/:id",getNamirniceRecepta)

   server.get("/recept/:naziv",getRecept)
   server.post("/recepti",postRecept)
   server.put("/recepti",putRecept)
   server.delete("/recept/:id",deleteRecept)
   
   server.post("/namirnice",postNamirnice)
   server.put("/namirnice",putNamirnice)
   server.put("/namirnica",putNamirnica)
   server.delete("/namirnice/:naziv",deleteNamirnice)

   server.post("/namirnicerecepta",postReceptNamirnice)
   server.delete("/namirnicerecepta/recepti/:id",deleteReceptNamirnice)
   
   server.post("/",)
   server.put("/",)
   server.delete("/",)
}


function getRecepti(zahtjev,odgovor){
    odgovor.type("application/json")
    let rDAO = new receptDAO();
    rDAO.dajSve().then((poruka) => {
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}

function postRecept(zahtjev,odgovor){
    odgovor.type("application/json")
    let rDAO = new receptDAO();
    let podaci = zahtjev.body;
    rDAO.dodaj(podaci).then(() => {
        odgovor.send(true);
    }).catch((error) => {
        console.error(error);
    });
}

function putRecept(zahtjev,odgovor){
    odgovor.type("application/json");
    let rDAO = new receptDAO();
    let naziv = zahtjev.naziv;
    let opis = zahtjev.opis;
    let id = zahtjev.id;
    rDAO.azuriraj(naziv,opis,id).then(() => {
        odgovor.send();
    }).catch((error) => {
        console.error(error);
    });
}

function getRecept(zahtjev,odgovor){
    odgovor.type("application/json");
    let rDAO = new receptDAO();
    let naziv = zahtjev.params.naziv;
    rDAO.daj(naziv).then((recept) => {
        console.log(JSON.stringify(recept))
        odgovor.send(recept);
    }).catch((error) => {
        console.error(error);
    });
}

function deleteRecept(zahtjev,odgovor){
    odgovor.type("application/json")
    console.log("Dosao sam do ovdje")
    let rDAO = new receptDAO();
    let id = zahtjev.params.id;
    rDAO.obrisi(id).then(() => {
        odgovor.send(true);
    }).catch((error) => {
        console.error(error);
    });
}

function getNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    
    nDAO.dajSve().then(async (poruka) => {
        let mjDAO = new mjernajedinicaDAO();
        let mjernajedinica = await mjDAO.dajSve();
        for(namirnica in poruka){
            //console.log(namirnica +". NAMIRNICA:" +JSON.stringify(poruka[namirnica])+ "\n")
                for(mj in mjernajedinica){
                    //console.log(namirnica+ " . NAMIRNICA: "+ " PROVJERA ZA MJERNU JEDINICU: "+JSON.stringify(mjernajedinica[mj]))
                if(mjernajedinica[mj].id == poruka[namirnica].mjerna_jedinica_id){

                    poruka[namirnica]['mjerna_jedinica_id'] = mjernajedinica[mj];
                }
                
                //console.log(poruka[namirnica])
                }
                
            
        }
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}

function getNamirnica(zahtjev, odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    let naziv = zahtjev.params.naziv
    
    nDAO.daj(naziv).then(async (poruka) => {
        console.log("Namirnica koju pretražujemo: " + JSON.stringify(poruka))
        let mjDAO = new mjernajedinicaDAO();
        let mjernajedinica = await mjDAO.dajSve();
        console.log("Mjernejedinice (sve)" + JSON.stringify(mjernajedinica))
        for(mj in mjernajedinica){
            console.log(mjernajedinica[mj].id + "==" + poruka[0].mjerna_jedinica_id)
            if(mjernajedinica[mj].id == poruka[0].mjerna_jedinica_id){
                poruka[0].mjerna_jedinica_id = mjernajedinica[mj];
                break;
            }
        }
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}

function postNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    let podaci = zahtjev.body;
    nDAO.dodaj(podaci).then(() =>{
        odgovor.send(true);
    }).catch((error) =>{
        console.log(error)
    });
}

function putNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    let kolicina_kupovina = zahtjev.body.kolicina_kupovina;
    let kolicina_hladnjak = zahtjev.body.kolicina_hladnjak;
    let naziv = zahtjev.body.naziv;

    if(kolicina_hladnjak == -1){
        nDAO.azurirajListuZaKupnju(naziv,kolicina_kupovina).then(() =>{
            odgovor.send(true);
        }).catch((error) => {
            console.log(error)
        })
    } 
    else if(kolicina_kupovina == -1){
        nDAO.azurirajHladnjak(naziv,kolicina_hladnjak).then(() =>{
            odgovor.send(true);
        }).catch((error) => {
            console.log(error)
        })
    } 
    else{
        nDAO.azurirajSve(naziv,kolicina_hladnjak,kolicina_kupovina).then(() =>{
            odgovor.send(true);
        }).catch((error) => {
            console.log(error)
        })
    }
}

function deleteNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    let naziv = zahtjev.params.naziv;
    nDAO.obrisi(naziv).then(() =>{
        odgovor.send(true);
    }).catch((error) => {
        console.log(error);
    })
}

function putNamirnica(zahtjev,odgovor){
    odgovor.type("application/json")
    let nDAO = new namirnicaDAO();
    let novi_podaci = zahtjev.body;
    nDAO.azurirajNamirnicu(novi_podaci).then(() =>{
        odgovor.send(true);
    }).catch((error) => {
        console.log(error);
    })
}

function getMjerneJedinice(zahtjev,odgovor){
    odgovor.type("application/json")
    let mjDAO = new mjernajedinicaDAO();
    mjDAO.dajSve().then((poruka) => {
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}



function getMjernaJedinica(zahtjev,odgovor){
    odgovor.type("application/json")
    let id = zahtjev.params.id
    let mjDAO = new mjernajedinicaDAO();
    mjDAO.daj(id).then((poruka) => {
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}



function getNamirniceRecepta(zahtjev,odgovor){
    odgovor.type("application/json")
    let id = zahtjev.params.id
    let nrDAO = new namirnicareceptaDAO();
    nrDAO.dajSveNamirnice(id).then((poruka) => {
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}

 

function getRecepteNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let id = zahtjev.params.id
    let nrDAO = new namirnicareceptaDAO();
    nrDAO.dajSveRecepte(id).then((poruka) => {
        odgovor.send(JSON.stringify({"results" : poruka}));
    }).catch((error) => {
        console.error(error);
    });
}

function deleteReceptNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let id = zahtjev.params.id
    let nrDAO = new namirnicareceptaDAO();
    nrDAO.obrisi(id).then(() => {
        odgovor.send(true);
    }).catch((error) => {
        console.error(error);
    });
}

function postReceptNamirnice(zahtjev,odgovor){
    odgovor.type("application/json")
    let podaci = zahtjev.body
    console.log("dobivena namirnica: " + podaci);
    let nrDAO = new namirnicareceptaDAO();
    nrDAO.dodaj(podaci).then(() => {
        odgovor.send(true);
    }).catch((error) => {
        console.error(error);
    });
}
