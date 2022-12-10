const Baza = require("../baza.js");

class namirnicaDAO{
    
    constructor() {
		this.baza = new Baza();
	}

    dajSve = async function () {
        this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM heroku_d1561a1a0615483.namirnica"
        var podaci = await this.baza.izvrsiUpit(sql, [])
        this.baza.zatvoriVezu();
        return podaci;
    }
    
    dodaj = async function (namirnica) {
        let sql = "INSERT INTO heroku_d1561a1a0615483.namirnica (naziv,kolicina_hladnjak,mjerna_jedinica_id,kolicina_kupovina) VALUES (?,?,?,?)";
        let podaci= [namirnica.naziv,namirnica.kolicina_hladnjak,namirnica.mjerna_jedinica_id,namirnica.kolicina_kupovina]
        await this.baza.izvrsiUpit(sql,podaci);
        return true;
    }
    
    obrisi = async function (naziv) {
        let sql = "DELETE FROM heroku_d1561a1a0615483.namirnica WHERE naziv=?";
        await this.baza.izvrsiUpit(sql,[naziv]);
        return true;
    }
    
    azuriraj = async function (KK,naziv) {
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET kolicina_kupovina=? WHERE naziv=?";
        let podaci = [KK,naziv]
        await this.baza.izvrsiUpit(sql,podaci);
        return true;
    }

}

module.exports = namirnicaDAO;