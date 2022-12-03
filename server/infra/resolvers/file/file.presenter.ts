import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilePresenter {
	@Field()
	public fieldname: string;

	@Field()
	public originalname: string;

	@Field()
	public url: string;

	constructor(props: FilePresenter) {
		Object.assign(this, props);
	}
}
