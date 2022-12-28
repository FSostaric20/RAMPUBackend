const Baza = require("../baza.js");

class receptDAO{

    constructor(){
        this.baza = new Baza();
    }

    dajSve = async function () {
        this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM heroku_d1561a1a0615483.recept"
        var podaci = await this.baza.izvrsiUpit(sql, [])
        this.baza.zatvoriVezu();
        return podaci;
    }

    daj = async function (naziv) {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT * FROM heroku_d1561a1a0615483.recept WHERE naziv LIKE %${naziv}%`
        var podaci = await this.baza.izvrsiUpit(sql, [])
        this.baza.zatvoriVezu();
        if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
    }

    dodaj = async function (recept) {
		let sql = "INSERT INTO heroku_d1561a1a0615483.recept (naziv,opis) VALUES (?,?)";
        let podaci = [recept.naziv,recept.opis];
		await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function (id) {
        console.log("Ovo je ID koji se briše: " + id)
		let sql = "DELETE FROM heroku_d1561a1a0615483.recept WHERE id=?";
		await this.baza.izvrsiUpit(sql,[id]);
        this.baza.zatvoriVezu();
		return true;
	}

    azuriraj = async function (naziv,opis,id) {
        let sql = "UPDATE heroku_d1561a1a0615483.recept SET naziv=?, opis=? WHERE id=?";
        let podaci = [naziv,opis,id]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }


}

module.exports = receptDAO;