const express = require('express');
const path = require('path');
const { threadId } = require('worker_threads');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

// //middelware1
// app.use(function(req, res, next){
//     req.myName="Arpan";
//     // console.log('middleware 1 called');
//     next();
// });

// //middleware2
// app.use(function(req, res, next){
//     console.log("My Name from MW2",req.myName);
//     // console.log('middleware 2 called');
//     next();
// });


var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
]

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});


// app.get('/', function(req, res){
//     //console.log("from the get route controller",req.myName);
//     return res.render('home',{
//         title: "Contact List",
//         contact_list: contactList
//     });
// })
app.get('/', function(req, res){


    Contact.find({}, function(err, contacts){
        if(err){
            console.log("error in fetching contacts from db");
            return;
        }
        return res.render('home',{
            title: "Contact List",
            contact_list: contacts
        });

    })
  
})
app.post('/create-contact', function(req, res){

//    console.log(req.body);
//     console.log(req.body.name);
//     console.log(req.body.phone);
    //    contactList.push({
    //     name:req.body.name,
    //     phone:req.body.phone
    //    })
    //    contactList.push(req.body); 
        Contact.create({
            name: req.body.name,
            phone: req.body.phone
        }, function(err, newContact){
            if(err){console.log('error in creating a contact!');
                return;}
                
                console.log('******', newContact);
                return res.redirect('back');
        });
       
});

// for deleting a contact
// app.get('/delete-contact',function(req,res){
//     //the value of phone comes when u click delete button

//     // console.log(req.query);
//     //get the query from the url
//     let phone=req.query.phone;
    
//     let contactIndex=contactList.findIndex(contact=>contact.phone==phone);
    
//     if(contactIndex!=-1){
//         contactList.splice(contactIndex,1);
//     }

//     return res.redirect('back');


// });

//for deleting a contact
app.get('/delete-contact/', function(req, res){
// get the id from query in the url
    let id = req.query.id;

    //find the contact in the database using the id and delete  
    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log('error in deleting the object from database');
            return;
        }
        return res.redirect('back');
    }); 


   
});

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})