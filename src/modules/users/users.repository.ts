import { Users } from "src/entites/users.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {

}