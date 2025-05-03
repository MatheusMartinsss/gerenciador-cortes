import { AutexTable } from "@/components/tables/AutexTable";
import { Button } from "@/components/ui/button";


export default function Autex() {
    return (
        <div className="flex w-full flex-col space-y-2">
            <AutexTable />
        </div>
    )
}