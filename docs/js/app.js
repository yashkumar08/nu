App = {
  loading: false,
  contracts: {},  
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);

  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Sample = await $.getJSON('College.json')
    App.contracts.Sample = TruffleContract(Sample)
    App.contracts.Sample.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.college = await App.contracts.Sample.deployed();
  },


  render: async () => {
    var role=await App.college.roles(App.account);
    var admin=await App.college.admin();
    if(admin.tostring().touppercase()==App.account.tostring().touppercase()){
      var totaluses=await App.college.totaluses();
      var count=parseInt(totalusers);
      $("displayusers").empty;
      for(var i=1;i<=count;i++){
        var user=await App.college.user(parseInt(i));
        var str="<tr><td>"+user[0]+"/<td><td>"+user[1]+"/<td><td>"+user[2]+"/<td><td>"+user[3]+"/<td><tr>";
        $("displayusers").append(str)
      }

      $("#studentdashboard").hide();
      $("#signupPage").hide();
      $("#teacherdashboard").hide(); 
      $("#officedashboard").hide(); 
      $("admindashboard").show();

    }

   else if(role=="1"){
     //this is student
    userinfo=await App.college.getUserInfo(App.account);
    $("#dispSname").html(userinfo[0])
    $("#dispSemail").html(userinfo[1])
    $("#dispSphone").html(userinfo[2])
     $("#studentdashboard").show();
     $("#signupPage").hide();
     $("#teacherdashboard").hide(); 
     $("#officedashboard").hide(); 
     $("admindashboard").hide() 
   }
   else if(role=="2"){
    userinfo=await App.college.getUserInfo(App.account);
    $("#dispTname").html(userinfo[0])
    $("#dispTemail").html(userinfo[1])
    $("#dispTphone").html(userinfo[2])
    $("#studentdashboard").hide();
    $("#signupPage").hide();
    $("#teacherdashboard").show(); 
    $("#officedashboard").hide();
    $("admindashboard").hide(); 
   }
   else if(role=="3"){
    userinfo=await App.college.getUserInfo(App.account);
    $("#dispOname").html(userinfo[0])
    $("#dispOemail").html(userinfo[1])
    $("#dispOphone").html(userinfo[2])
    $("#studentdashboard").hide();
    $("#signupPage").hide();
    $("#teacherdashboard").hide(); 
    $("#officedashboard").show();
    $("admindashboard").hide(); 
   }
   else{
     //new user 
     $("#studentdashboard").hide();
     $("#signupPage").show();
     $("#teacherdashboard").hide(); 
     $("#officedashboard").hide();
     $("admindashboard").hide(); 
   }

  } ,
  register :async ()=>{
    var role=$("#selectrole").val();
    var uname=$("#uname").val();
    var uemail=$("#uemail").val();
    var uphno=$("#uphno").val();
    await App.college.addUser(uname,uemail,uphno,role,{from:App.account});
    await App.render();
  }


}
