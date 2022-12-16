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

    daj = async function (naziv) {
        this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM heroku_d1561a1a0615483.namirnica WHERE naziv = ?"
        let podaci = [naziv]
        let odgovor = await this.baza.izvrsiUpit(sql, podaci)
        this.baza.zatvoriVezu();
        return odgovor;
    }
    
    dodaj = async function (namirnica) {
        let sql = "INSERT INTO heroku_d1561a1a0615483.namirnica (naziv,kolicina_hladnjak,mjerna_jedinica_id,kolicina_kupovina) VALUES (?,?,?,?)";
        let podaci= [namirnica.naziv,namirnica.kolicina_hladnjak,namirnica.mjerna_jedinica_id.id,namirnica.kolicina_kupovina]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }
    
    obrisi = async function (naziv) {
        let sql = "DELETE FROM heroku_d1561a1a0615483.namirnica WHERE naziv=?";
        await this.baza.izvrsiUpit(sql,[naziv]);
        return true;
    }
    
    azurirajSve = async function (naziv, kolicina_hladnjak, kolicina_kupovina) {
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET kolicina_hladnjak=?, kolicina_kupovina=? WHERE naziv=?";
        let podaci = [kolicina_hladnjak, kolicina_kupovina, naziv]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }

    azurirajHladnjak = async function (naziv, kolicina_hladnjak) {
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET kolicina_hladnjak=? WHERE naziv=?";
        let podaci = [kolicina_hladnjak, naziv]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }

    azurirajListuZaKupnju = async function (naziv, kolicina_kupovina) {
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET kolicina_kupovina=? WHERE naziv=?";
        let podaci = [kolicina_kupovina,naziv]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }

    azurirajNamirnicu = async function (novi_podaci) {
        console.log("novi naziv")
        console.log(novi_podaci.naziv)
        console.log("novi MJ")
        console.log(novi_podaci.mjerna_jedinica_id.id)
        console.log("id namirnice")
        console.log(novi_podaci.id)
        let sql = "UPDATE heroku_d1561a1a0615483.namirnica SET naziv=?, mjerna_jedinica_id=? WHERE id=?";
        let podaci = [novi_podaci.naziv,novi_podaci.mjerna_jedinica_id.id,novi_podaci.id]
        await this.baza.izvrsiUpit(sql,podaci);
        this.baza.zatvoriVezu();
        return true;
    }

}

module.exports = namirnicaDAO;