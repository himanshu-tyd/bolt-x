import { toast } from "sonner"


export const catchError=(e :  unknown | Error)=>{
    console.log(e) 
    if(e instanceof Error) {
        toast.error(e.message)
    }else{
         toast.error(e as string)
    }
}