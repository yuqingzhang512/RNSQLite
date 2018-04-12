/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    var number = [];
    for (var i = 0; i < 10000; i++) {
      number.push({
        key: ""+i
      });
    }
    this.state = {
      person: [],
      db: null,
      list: number
    };
  }

  errorCB(err) {
    console.log("SQL Error: " + err);
  }
  
  successCB() {
    console.log("SQL executed fine");
  }
  
  openCB() {
    console.log("Database OPENED");
  }

  componentWillMount() {
    var db = SQLite.openDatabase("test.db", "1.0", "Test Database", 200000, this.openCB, this.errorCB);
    if (db) {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Person(id REAL UNIQUE, name TEXT)', [], (tx, results) => {
          console.log("create success");

          this.setState({
            db: db
          });
          this.displayData();
        }, (tx, error) => {
          alert("Fail to create database. " + error.message);
        })
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text> */}
        <Button style={{marginTop: 64}}
          title="Add"
          onPress={this.onPressAdd.bind(this)}/>
        <Button
          title="Clean"
          onPress={this.onPressClean.bind(this)}/>
        <FlatList
          data={this.state.list}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
    );
  }

  onPressAdd() {
    var db = this.state.db;
    var that = this;
    let insertStatement = "INSERT INTO Person (id, name) VALUES (?, ?)";
    var startTime, endTime;
    db.transaction(tx => {
      startTime = new Date();
      for (var i = 0; i < 100000; i++) {
        // console.log("start insert " + i);
        tx.executeSql(insertStatement, [i, "Zhang-"+i]);
      }
      // tx.executeSql(insertStatement, [1, "A"]);
      // that.displayData();
      // tx.executeSql("SELECT COUNT(*) AS c FROM Person", [], (tx, results) => {
      //   let index = results.rows.item(0).c + 2;
      //   tx.executeSql("INSERT INTO Person (id, name) VALUES (?, ?)", [index, 'Zhang-' + index], (tx, results) => {
      //     that.displayData();
      //   }, (tx, error) => {
          
      //   });
      // });
    }, () => {
    }, () => {
      endTime = new Date();
      let str = "batch insert finish, " + (endTime - startTime)/1000 + "s";
      console.log(str);
      // alert(str);
      // that.displayData();
    });
    console.log("press finish");
  }

  onPressClean() {
    var db = this.state.db;
    var that = this;
    db.transaction(tx => {
      tx.executeSql("DELETE FROM Person", [], (tx, results) => {
          that.displayData();
        }, (tx, error) => {
          alert("Delete error: " + error.message);
        });
    });
  }

  displayData() {
    // var db = this.state.db;
    // var that = this;
    // db.transaction((tx) => {
    //   tx.executeSql('SELECT * FROM Person', [], (tx, results) => {
    //       console.log("Query completed");
    //       var person = [];
    //       var len = results.rows.length, i, item;
    //       for (i = 0; i < len; i++){
    //         item = results.rows.item(i);
    //         person.push({
    //           key: ""+item.id,
    //           name: item.name
    //         });
    //       }
    //       that.setState({
    //         person: person
    //       });
    //     }, (tx, error) => {
    //       alert("Error");
    //     });
    // });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
    marginTop: 64,
  }
});
