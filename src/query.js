export const LOGIN = `
    *[_type == "user" && username == $username && password == $password && references('${process.env.CUSTOMER_ROLE}')] 
    { 
        _id,
        fullName,
        email,
        phone,
        address,
        username
    }
`
export const RE_LOGIN = `
    *[_type == "user" && _id == $_id && references('${process.env.CUSTOMER_ROLE}')] 
    { 
        _id, 
        fullName, 
        email, 
        phone, 
        address, 
        username 
    }
`
