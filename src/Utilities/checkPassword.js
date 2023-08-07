export default function checkPasswordStrength(password) {

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /\d/;
        const specialCharRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~-]/;
    
        let strength = 0;
        if (uppercaseRegex.test(password)) strength++;
        if (lowercaseRegex.test(password)) strength++;
        if (numberRegex.test(password)) strength++;
        if (specialCharRegex.test(password)) strength++;
        return strength;    
}