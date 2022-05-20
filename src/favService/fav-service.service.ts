import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';
import {Actividad} from '../app/objetos';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class FavServiceService {

  readonly dbName: string = 'remotestack2.db';
  readonly dbTable: string = 'favsTable';
  activities: Array<string>;
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
          alert(res.rows.item(i).activity);
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
      SELECT * FROM ${this.dbTable} WHERE email = ?`, [email])
      .then((res) => ({
        userId: res.rows.item(0).user_id,
        email: res.rows.item(0).email,
        activity: res.rows.item(0).activity
      }));
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
  }

  async checkActivity(activity, email): Promise<boolean>{
    return this.dbInstance.executeSql(`
      SELECT * FROM ${this.dbTable} WHERE email = ? AND activity = ?`, [email, activity])
      .then((res) => (res.rows.length !== 0))
      .catch(e => false);
  }
}
