const functions = require("firebase-functions");
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
const ALGOLIA_APP_ID = "ZO4XKCM05Q";
const ALGOLIA_ADMIN_KEY = "49384a23839a2fcf329b62df02adf06e";
const ALGOLIA_INDEX_NAME = "Event";
admin.initializeApp(functions.config().firebase);

// exports.setAlogliaApp = functions.firestore
//     .document("Event/{Event}")
//     .onWrite((change, context) => {
//         //init algolia client
//         const index = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);
//         exports.setAlogliaApp = functions.firestore
//         .document("Event/{Event}")
//         .onWrite((change, context) => {
//             //init algolia client
//             const index = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);
//             if (!change.before.exists && change.after.exists) {
//                 const Description = change.after.data();
//                 Description.objectID = change.after.id;
//                 index.saveObject(Description);
//             }else if (change.before.exists && change.after.exists) {
//                 if (
//                     //ConditionBlockStart
//                     (change.before.data().Description !== change.after.data().Description)
//                     //ConditionBlockEnd
//                 ){
//                     const Description = change.after.data();
//                     Description.objectID = change.after.id;
//                     //update - create record operation are same.
//                     index.saveObject(Description);
//                 }else if (change.before.exists && !change.after.exists) {
//                     index.deleteObject(change.before.id);
//                 }
//             };
//             return null;
//         });
//     });

exports.createPost = functions.firestore.collection('Event/{Eventid}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        newValue.objectID = snap.id;

        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

        var index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(newValue);
        console.log("Finished");
    });

exports.updatePost = functions.firestore.collection('Event/{Eventid}')
    .onUpdate(async (snap, context) => {
        const afterUpdate = snap.after.data();
        afterUpdate.objectID = snap.after.id;

        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

        var index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.saveObject(afterUpdate);
    });

exports.deletePost = functions.firestore.collection('Event/{Event}')
    .onDelete(async (snap, context) => {
        const oldID = snap.id;
        var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

        var index = client.initIndex(ALGOLIA_INDEX_NAME);
        index.deleteObject(oldID);
    });

