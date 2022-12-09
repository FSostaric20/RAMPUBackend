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
        let podaci= [namirnica.naziv,namirnica.KH,namirnica.mjID,namirnica.KK]
        await this.baza.izvrsiUpit(sql,podaci);
        return true;
    }
    
    obrisi = async function (id) {
        let sql = "DELETE FROM heroku_d1561a1a0615483.namirnica WHERE id=?";
        await this.baza.izvrsiUpit(sql,[id]);
        return true;
    }
    
    azuriraj = async function (KH,KK,id) {
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET kolicina_hladnjak=?, kolicina_kupovina=? WHERE id=?";
        let podaci = [KH,KK,id]
        await this.baza.izvrsiUpit(sql,podaci);
        return true;
    }

}

module.exports = namirnicaDAO;