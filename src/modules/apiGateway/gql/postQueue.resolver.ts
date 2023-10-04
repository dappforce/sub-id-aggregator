import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

@Resolver()
export class PostQueueResolver {
  constructor() {}

  @Query(() => String)
  pingPong(): string {
    return 'Hello World!';
  }
}
