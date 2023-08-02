import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"
import { User } from "./user.entity"

describe("AuthService", () => {
    let service: AuthService
    let fakeUserService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = []
        fakeUserService = {
            find: (email:string) => {
                const filteredUser = users.filter(user => user.email == email)
                return Promise.resolve(filteredUser)
            },
            create: (email: string, password: string) => {
                const user:User = {id:Math.random()*999999,email,password} 
                users.push(user)
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ],
        }).compile()

        service = module.get(AuthService)
    });

    it("can create an instance of of auth service", async () => {
        expect(service).toBeDefined()
    });

    it("create a new user with a salted and hash password", async () => {
        const user = await service.signup("abc@dc.com","abcd")
        expect(user).not.toEqual("abcd");
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    });
    
    it("throws an error if user signs up with email that is use", async () => {
        fakeUserService.find = () => Promise.resolve([{id:1, email:"a", password:"1"}])
        await expect(service.signup("abc@dc.com","abcd")).rejects.toThrow("email in use")
    })

    it("throws if sign in called with an unuse email", async () => {
        await expect(service.signin("abc@dc.com","abcd")).rejects.toThrow("user not found")
    })

    it("throws if an invalid password provided", async () => {
        fakeUserService.find = () => Promise.resolve([{email:"abc@gmail.com", password:"password.12"} as User])
        await expect(service.signin("abc@dc.com","password.12")).rejects.toThrow("user not found")
    });

    it("return a user if correct password", async () => {
        service.signup("abc@gmail.com","password");
    })
})
