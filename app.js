
const express = require("express")
const path = require("path")
const ejs = require('ejs');
const dt = require(__dirname + '/module.js')
const bodyParser = require("body-parser");
const newDate = require("./module");
const _ =require("lodash")
const mongoose=require("mongoose");




const app = express()
const port = 80;

app.use(express.static(path.join(__dirname, "static", "css")))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/form', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});
const itemschema=new mongoose.Schema({name:String})
const itemform= mongoose.model("itemform" , itemschema)

const listschema=new mongoose.Schema(
    {  listname:String ,
       urlitem: [itemschema]
})
const List = mongoose.model("List" , listschema)
const itemform1= new itemform({name:'food'})
const itemform2= new itemform({name:'specialfood'})
const defaultitem=[itemform1,itemform2]

 
app.get("/" ,(req, res)=>{
    itemform.find({},(err , finditem)=>{
         if(finditem.length===0){
            itemform.insertMany(defaultitem , (err)=>{
                if(err){
                    console.log("error")

                }
                else{console.log("data store in db succesfully")}
            })
            res.redirect("/")
        }
        else{
            let day = dt.newDate()
            res.render("home",{todaylist:'Today' , newItem: finditem}


            )
        }
        
    })    
})
app.post("/",(req,res)=>{
    
    let items = req.body.item
    let titleurl=req.body.list
    const itemf= new itemform({name:items})
    let day = dt.newDate()
    
    if(titleurl==='Today'){
        
        itemf.save()
        res.redirect("/")}
    
    
    else{  
        List.findOne({listname:titleurl},(err , listfind)=>{
            
            listfind.urlitem.push(itemf)
            listfind.save()
            res.redirect("/"+titleurl)
        }) }
})

app.get("/:customurl" ,(req,res)=>{
       let newurl=_.capitalize( req.params.customurl)
    if(newurl==='Today'){
       res.redirect("/")
    }
    else{
       List.findOne({listname:newurl},(err,listfind)=>{
           if (!listfind){
               let list1= new List({
              listname:newurl,
              urlitem: defaultitem})
    
           
           list1.save()
             res.redirect("/"+newurl)
         
          
       }
       
       else{
        res.render("home" , {todaylist: newurl, newItem: listfind.urlitem} )
       }
       
      })}
})

app.post("/delete" ,(req,res)=>{
         let newurl=req.body.hide
         let deleteitem=req.body.checkbox
         let day= dt.newDate()
         
         if(newurl==='Today'){
            itemform.findByIdAndRemove(deleteitem , (err)=>{
                if(err){
                  console.log("not delete")
                //   res.redirect("/")
                }
                else{
                  res.redirect("/")
                }})

               }
         
         else{
            List.findOneAndUpdate({listname:newurl},{$pull:{urlitem:{_id:deleteitem}}},(err,foundlist)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect("/"+newurl)
                }
            })
        
         }

  
        
})
app.listen(port, () => {
    console.log("server starts ")
})