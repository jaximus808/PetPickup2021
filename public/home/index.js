let userData; 

const init = () =>
{

    // if(!accessToken)
    // {
    //     document.getElementById("loading").style.display = "none";
    //     document.getElementById("redirect").style.display = "inline";
    //     return;
    // } 
    fetch("http://localhost:3000/api/user/accountDetails",{
        method:"GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data.json())
    .then(res => {
        
        if(!res.error) 
        {
            userData = res.body;
            document.getElementById("noLogin").style.display = "none";
            document.getElementById("userDisplay").style.display = "inline"
            document.getElementById("username").innerText = res.username;
        }
    })    
}

const logout = () =>
{
    fetch("http://localhost:3000/api/user/logOut",{
        method:"GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data.json())
    .then(res => {
        window.location.href = "/";
    })    
}

const userInfo = () => 
{
    if(document.getElementById("userInfoDisplay").style.display == "none")
    {
        document.getElementById("userInfoDisplay").style.display = "inline";

    }
    else 
    {
        document.getElementById("userInfoDisplay").style.display = "none";
    } 
}

function loginPrompt()
{
    if(document.getElementById("loginContainter").style.display == "none")
    {
        document.getElementById("loginContainter").style.display = "inline";

    }
    else 
    {
        document.getElementById("loginContainter").style.display = "none";
    }
}

const login = () =>
{
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    fetch("http://localhost:3000/api/user/loginUser", {
        method:"POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(data => data.json())
    .then(res => {

        if(res.error) 
        {
            document.getElementById("status").innerHTML=`status: ${res.message}`
        }
        else 
        {
            
            window.location.href = "/auth/viewPet/";
        }
        console.log(res)
    });
}

function RedirectRegister()
{
    window.location.href = "/user/register"
}

init();