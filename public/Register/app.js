function init()
{
    
}

const Register = () =>
{
    const data = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phoneNumber").value,
        password: document.getElementById("password").value
    }
    console.log(document.getElementById("phoneNumber").value)
    fetch("http://localhost:3000/api/user/createUser", {
        method:"POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(data =>data.json())
    .then(res => {
        if(res.error) 
        {
            document.getElementById("status").innerHTML=`status: ${res.message}`
            
        }
        else 
        {
            if(localStorage.getItem("access-token")) localStorage.removeItem("access-token")
            localStorage.setItem("access-token",res.message);
            window.location.replace("/auth/viewPet/");
        }
    });
}