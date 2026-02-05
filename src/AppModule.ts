import { module } from "inversiland";
import { PostModule } from "./post/PostModule";
import { CoreModule } from "./core/CoreModule";
import { AuthModule } from "./auth/AuthModule";

@module({
  imports: [CoreModule, PostModule, AuthModule],
})
export default class AppModule {}
