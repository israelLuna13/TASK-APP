import {CorsOptions} from 'cors'

//we acept request o we deneget
export const corsConfig:CorsOptions={

    origin:function(origin,callback){
        //whiteListe with the url of our fontend
        const wthiteList=[process.env.FRONTEND_URL]
        //if the request that comes is on our whitelist, we accept the request
        if(wthiteList.includes(origin)){

            callback(null,true)
        }else{
            callback(new Error('Error of CORS'))
        }
    }
}