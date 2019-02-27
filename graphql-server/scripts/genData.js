import mongoose from "mongoose";
import { Guser, Booking, Node, PermissionGroup } from '../models/Test.js';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export default {
  genData: (res) => {
    var db = mongoose.connection;
    mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@mongodb:27017/test?authSource=admin', { useNewUrlParser: true });
    db.on('error', function(err) {
      res.send(err)
    })
    db.once('open', function() {
      // we're connected!
      let nodeData = [];
      for(let i=0; i < 8000; i++) {
        nodeData.push({_id: mongoose.Types.ObjectId(), name: i})
      }

      let groupData = [];
      for(let i=0; i < 4000; i++) {
        let randomNode = [];
        for(let j=0; j < 2; j++) {
          randomNode.push(nodeData[getRandomIntInclusive(0, 7999)]["_id"])
        }
        groupData.push({_id: mongoose.Types.ObjectId(), name: i, nodes: randomNode});
      }

      let bookingData = [];
      for(let i=0; i < 10000; i++) {
        let randomNode = [];
        let numberOfRandomNode = getRandomIntInclusive(6, 10);
        for(let j=0; j < numberOfRandomNode; j++) {
          randomNode.push(nodeData[getRandomIntInclusive(0, 7999)]["_id"])
        }
        bookingData.push({name: i, nodes: randomNode});
      }

      let userData =[];
      for(let i=0; i < 10000; i++) {
        let randomGroup = [];
        randomGroup.push(groupData[getRandomIntInclusive(0, 3999)]["_id"])
        userData.push({name: i, groups: randomGroup});
      }

      db.collection('Guser').insert(userData);
      db.collection('Booking').insert(bookingData);
      db.collection('PermissionGroup').insert(groupData);
      db.collection('Node').insert(nodeData);

      res.send('generated');
    });
  }
}