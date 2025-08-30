import { GalleryVerticalEnd } from 'lucide-react'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'

export default function Login() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <a
                                    href="#"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-md">
                                        <GalleryVerticalEnd className="size-6" />
                                    </div>
                                    <span className="sr-only">Velmo</span>
                                </a>
                                <h1 className="text-xl font-bold pb-6">
                                    Welcome to Velmo
                                </h1>
                                <Button
                                    variant="default"
                                    type="button"
                                    onClick={() => signIn('authentik')}
                                >
                                    Sign in with Authentik
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
