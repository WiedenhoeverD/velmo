import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { AllAccounts } from './AllAccounts'
import Create from './Create'

export default function Accounts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center">
                        <div>Account Overview</div>
                        <div className="ml-auto">
                            <Create />
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AllAccounts />
            </CardContent>
        </Card>
    )
}
