class UserUsecase {

    getRole(dataFromSoup) {
        try {
            let result = this.getLastArray(dataFromSoup.GetUserDetailsResult.string);
            result = result.split(",");
            result = result[4];
            result = result.split("=");
            result = result[1];
            return result;
        } catch (error) {
            return null
        }
       
    }

    getStudentId(dataFromSoup) {
        try {
            let result = dataFromSoup.GetUserDetailsResult.string[0];
            return result;  
        } catch (error) {
            return null
        }
     
    }

    getLastArray(array = []) {
        const lastArray = array[array.length - 1]
        return lastArray
    }
}


module.exports = {
    userUsecase: new UserUsecase()
}