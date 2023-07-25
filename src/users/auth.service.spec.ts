import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service"

describe("AuthService", () => {
    let service: AuthService

    beforeEach(async () => {
        const fakeUserService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
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
    })
})