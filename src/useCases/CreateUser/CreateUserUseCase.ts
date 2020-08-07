import { IUsersRepository } from "../../repository/IUsersRepository"
import { ICreateUserRequestDTO } from "./CreateUserDTO"
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {
    constructor(private usersRepository: IUsersRepository,
        private mailProvider: IMailProvider) { }

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new Error('User user already exists!')
        }
        const user = new User(data);

        await this.usersRepository.save(user);
        this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: 'Equipe Teste',
                email: 'test@test.com'
            },
            subject: 'Welcome!',
            body: 'Now you have access to the platform!'
        })
    }
}