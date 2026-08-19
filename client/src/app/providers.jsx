import { QueryClientProvider } from "@tanstack/react-query";
import {queryClient} from '../api/queryClient.js'
export default function Providers({children}){
    return (
    <QueryClientProvider client={queryClient}>
         {children}
    </QueryClientProvider>
    )
}