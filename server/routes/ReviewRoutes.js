import express from 'express'
import {create_review,get_all_reviews,get_specific_review,update_review,delete_review} from '../services/ReviewService.js'
import { protect_route,allowed_to } from '../services/authService.js'
import {createreviewValidator,updateReviewValidator,deletereviewValidator } from '../middelwares/express_validator/ReviewValidator.js'
let review_route=express.Router()
review_route.route('/')
.post(protect_route,allowed_to('user'),createreviewValidator,create_review)
.get(get_all_reviews)
review_route.route('/:id')
.get(protect_route,allowed_to('user'),get_specific_review)
.put(protect_route,allowed_to('user'),updateReviewValidator,update_review)
.delete(protect_route,allowed_to('user','admin'),deletereviewValidator,delete_review)
export {review_route}
