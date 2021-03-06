import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';
import {Actividad} from '../app/objetos';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class FavServiceService {

  readonly dbName: string = 'users.db';
  readonly dbTable: string = 'favs';
  activities: Array<Actividad>;
  activities2: string[];
  private dbInstance: SQLiteObject;

  constructor(private platform: Platform, private sqlite: SQLite) {
    // Creating the database
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      }).then((sqLite: SQLiteObject) => {
        this.dbInstance = sqLite;
        sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                userId INTEGER PRIMARY KEY,
                email varchar(255),
                activity varchar(255))`, []);
      })
        .catch((error) => alert('error'));
    })
      .catch((error) => alert('error'));
  }
  // Add new Fav Activity
  addFav(email, activity) {
    // validation
    if (!email.length || !activity.length) {
      alert('Provide both email & name');
      return;
    }
    this.dbInstance.executeSql(`
        INSERT INTO ${this.dbTable} (email, activity) VALUES ('${email}', '${activity}')`, [])
      .then(() => {});
    this.dbInstance.executeSql(`COMMIT`);
  }

  getAllFavs() {
    return this.dbInstance.executeSql(`
      SELECT * FROM ${this.dbTable}`, []).then((res) => {
      this.activities = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          this.activities.push(res.rows.item(i).activity);
        }
        return this.activities;
      }
    }, (e) => {
      alert(JSON.stringify(e));
    });
  }

  // Get user by user email
  getActivities(email): Promise<any> {
    return this.dbInstance.executeSql(`
      SELECT * FROM ${this.dbTable} WHERE email = ?`, [email]).then((res) => {
      this.activities2 = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          this.activities2.push(res.rows.item(i).activity);
        }
        return this.activities2;
      }
    });
  }

  // Delete seleted activity
  deleteFav(email, activity) {
    this.dbInstance.executeSql(`
      DELETE FROM ${this.dbTable} WHERE activity = ? AND email = ?`, [activity, email])
      .then(() => {
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
    this.dbInstance.executeSql(`COMMIT`);
  }

  async checkActivity(activity, email): Promise<boolean>{
    return this.dbInstance.executeSql(`
      SELECT * FROM ${this.dbTable} WHERE email = ? AND activity = ?`, [email, activity])
      .then((res) => (res.rows.length !== 0))
      .catch(e => false);
  }
}
