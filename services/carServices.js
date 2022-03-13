export class carServices {
    getCar() {
        return axios({
            url:"https://621f71fbce99a7de193c8524.mockapi.io/cars",
            method:'GET'
        })
    }
    getOneCar(id) {
        return axios({
            url:`https://621f71fbce99a7de193c8524.mockapi.io/cars/${id}`,
            method:'GET'
        })
    }
    addCar(sp) {
        return axios({
            url:"https://621f71fbce99a7de193c8524.mockapi.io/cars",
            method:'POST',
            data:sp
        })
    }
    deleteCar(id) {
        return axios({
            url: `https://621f71fbce99a7de193c8524.mockapi.io/cars/${id}`,
            method: 'DELETE',
        })
    }
    editCar(id,sp){
        return axios({
            url: `https://621f71fbce99a7de193c8524.mockapi.io/cars/${id}`,
            method: 'PUT',
            data: sp
        })
    }
}