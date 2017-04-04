var app = {
    
    personId : 0,
    
    init: function(){
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    
    onDeviceReady: function(){
        window.addEventListener('push',app.pageChanged);
        
        app.pageChanged();
    },
    
    pageChanged : function(){
        if (document.getElementById("contact-list")){ //index.html
            app.peopleList();
            document.getElementById("savePro").addEventListener("click",app.savePro);
            document.getElementById("canPro").addEventListener("click",app.closeModal);
            document.getElementById("closebutton").addEventListener("touchend",app.clearModal);
            document.querySelector(".modal header h1").textContent = "add person";
           
        } else { //gift.html
            app.giftList();
            document.querySelector("header a.pull-left").addEventListener("touchend",function(){ // <back button
                    app.personId = 0;
            });
            document.getElementById("submitIdea").addEventListener("click",app.saveIdea);
            document.getElementById("cancel").addEventListener("click",app.closeModal);
            document.getElementById("closebutton").addEventListener("touchend",app.clearModal);
            
        }
    },
    
    giftList: function(){
        //{"giftid":12312312, "idea":"White Russian", "at":"LCBO", "cost":"", "url":"http://lcbo.com/"},
        let F= document.getElementById("gift-list");
        F.innerHTML = "";
        
        let people = JSON.parse(localStorage.getItem("giftr-elab0009"));
        for (let i=0 ; i< people.length; i++){
            if(people[i].id == app.personId){
                document.querySelector(".modal .content .content-padded").textContent = people[i].name;
                let ideas = people[i].ideas;
                
                for( let b=0 ; b < ideas.length; b++ ){
                    let giftItem = document.createElement("li");
                    giftItem.className = "table-view-cell media";
                
                    let span = document.createElement("span");
                    span.className = "pull-right icon icon-trash midline";
                    span.addEventListener("click",function(){
                        app.deletIdea(ideas[b].giftid);
                    })
                
                    let div = document.createElement("div");
                    div.className = "media-body";
                    div.textContent = ideas[b].idea;
                
                    if(ideas[b].at != ""){
                        let pL = document.createElement("p");
                        pL.textContent = ideas[b].at;
                        
                        div.appendChild(pL);
                        
                    }
                    
                     if(ideas[b].cost != ""){
                        let pC = document.createElement("p");
                        pC.textContent = ideas[b].cost;
                        
                        div.appendChild(pC);
                        
                    }
                      if(ideas[b].url != ""){
                        let pU = document.createElement("p");
                          
                        let aU = document.createElement("a");
                        aU.textContent = ideas[b].url;
                        aU.setAttribute("href",ideas[b].url);
                        aU.setAttribute("target", "_blank");
                        
                        pU.appendChild(aU);  
                        div.appendChild(pU);
                        
                    }
                    
                    giftItem.appendChild(span);
                    giftItem.appendChild(div);
                    F.appendChild(giftItem);
                }
                
                break; //found right person. does not need to check next person
            }
        }
        
       
        
        
        
    },
    
    peopleList: function(){
        
        //read the local store
        let people = JSON.parse(localStorage.getItem("giftr-elab0009"));
        
        if (people != null) {
            people = people.sort(function( a , b ){
                let dateA = new Date(a.dob);
                let dateB = new Date(b.dob);

                if (dateA < dateB){
                    return -1;
                } else if(dateB < dateA){
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        
        if (people != null) {
            
            let E = document.getElementById("contact-list");
            
           
            
    
            E.innerHTML = "";

            for(let i = 0; i < people.length; i++){ 

                let listItem = document.createElement("li");
                listItem.className = "table-view-cell";
                
             
                

                let cName = document.createElement("span");
                cName.className = "name";
                

                let linkName = document.createElement("a");
                linkName.textContent = people[i].name;
                linkName.setAttribute("href","#personModal");
                linkName.addEventListener("touchend",function(){
                                                    app.fillDetail(people[i].id);
                                                  });
                cName.appendChild(linkName);
                
                let linkDob = document.createElement("a");

                linkDob.className = "navigate-right pull-right";
                linkDob.setAttribute("href","gifts.html");
                linkDob.addEventListener("touchend",function(){
                    app.personId = people[i].id;
                });
                

                let dOB = document.createElement("span");
                dOB.textContent = people[i].dob;
                dOB.className = "dob";

                E.appendChild(listItem);
                listItem.appendChild(cName);
                listItem.appendChild(linkDob);
                linkDob.appendChild(dOB);
            }
        }
        
    }, 
    
    fillDetail : function (id){
        let people = JSON.parse(localStorage.getItem("giftr-elab0009"));
        
        app.personId = id;
        
        document.querySelector(".modal header h1").textContent = "edit person";
        
       for(let i = 0; i < people.length; i++){ 
            if(id == people[i].id){
                document.getElementById("fullname").value = people[i].name;
                document.getElementById("dob").value = people[i].dob;
            }
       }
    },
    
    clearModal : function(){
         if (document.getElementById("contact-list")){ //index.html
             
            document.getElementById("fullname").value = "";
            document.getElementById("dob").value = "";
            app.personId = 0;
            
             document.querySelector(".modal header h1").textContent = "add person";
             
         } else { //gift.html
             
              document.getElementById("giftIdea").value = "";
            document.getElementById("store").value = "";
             document.getElementById("cost").value = "";
             document.getElementById("url").value = "";
         }
    },
    
    closeModal : function(){
        app.clearModal(); //clean modal content 
        let event = new CustomEvent("touchend", { bubbles : true , cancelable : true });
        document.getElementById("closebutton").dispatchEvent(event);
    },
    
    savePro : function(){

        let name = document.getElementById("fullname").value;
        let dob  = document.getElementById("dob").value;
        let id = Date.now();
        let ideas  = [];
        
        console.log(name, dob);
        
        if( name == "" || dob == ""){
            alert("Put something to save");
        }else{
        
        let data = JSON.parse(localStorage.getItem("giftr-elab0009"));

        if( data == null ){
            //create array of people
            data = [];    
        } 
        if (app.personId == 0) { //new person -> add new person
            data.push({"id":id, "name":name, "dob":dob, "ideas":ideas});    
        } else { //already exists -> edit existent person
            
            for(let i = 0; i < data.length ; i++){
                if(app.personId == data[i].id){
                    data[i].name = name;
                    data[i].dob = dob;
                    
                   
                   }
            }
            
        }
        
        localStorage.setItem("giftr-elab0009",JSON.stringify(data));
        
        app.peopleList(); //display the list
        app.closeModal();
        }
    }, 
    
    deletIdea : function(giftId){
        let people =  JSON.parse(localStorage.getItem("giftr-elab0009"));
          for(let i = 0; i < people.length ; i++){
             if(people[i].id == app.personId ){
                 
                  for(let b = 0; b < people[i].ideas.length ; b++){
                    
                      if(people[i].ideas[b].giftid == giftId){
                          
                          people[i].ideas.splice(b,1);
                          localStorage.setItem("giftr-elab0009",JSON.stringify(people));
                          app.giftList();
                          
                          break;
                      }
                      
                  }
                 
                 break;
             }
              
          }
        
        
    }, 
    
    saveIdea: function(){
        //{"giftid":12312312, "idea":"White Russian", "at":"LCBO", "cost":"", "url":"http://lcbo.com/"},
        let giftIdea =document.getElementById("giftIdea").value;
        let store =document.getElementById("store").value;
        let url =document.getElementById("url").value;
        let cost =document.getElementById("cost").value;
        let id =Date.now();
         
        console.log(giftIdea);
           if( giftIdea == "" ){
            alert("Put something to save");
        }else{
        
            let data = JSON.parse(localStorage.getItem("giftr-elab0009"));
            
            for(let i = 0; i < data.length ; i++){
                if(app.personId == data[i].id){
                    
                    data[i].ideas.push({"giftid":id , "idea":giftIdea, "at":store, "cost":cost ,  "url":url});
                    localStorage.setItem("giftr-elab0009",JSON.stringify(data));
                    app.giftList();
                    app.closeModal();
                    break;
                }
            }
                    
        
        }
        
    }
};

//app.init();
app.onDeviceReady();