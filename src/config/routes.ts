import * as Product from '../domain_product/info/route'
import * as Comment from '../domain_product/comment/route'
import * as News from '../domain_new/route'
import { UserRoute } from '../domain_user/route'
import { AuthRoute } from '../domain_auth/route'
import * as Shopping from '../domain_product/shopping/route'
export const routeConfig = { Product, News, Comment, Shopping, UserRoute, AuthRoute }
