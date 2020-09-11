

class UserUsecase {


    getRole(dataFromSoup) {
        let result = this.getLastArray(dataFromSoup.GetUserDetailsResult.string);
        result = result.split(",");
        result = result[4];
        result = result.split("=");
        result = result[1];
        return result;
    }

    getStudentId(dataFromSoup) {
        let result = dataFromSoup.GetUserDetailsResult.string[0];
        return result;
    }

    getLastArray(array = []) {
        const lastArray = array[array.length - 1]
        return lastArray
    }
}


module.exports = {
    userUsecase: new UserUsecase()
}