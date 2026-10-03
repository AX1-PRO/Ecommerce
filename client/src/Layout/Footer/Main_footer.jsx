import { Link } from 'react-router';



export default function Footer() {

  return (

    <footer className="bg-zinc-950 text-gray-300 border-t border-zinc-800">

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo & Description */}

          <div>

            <h2 className="text-2xl font-bold text-white">

              E-<span className="text-emerald-400">commerce</span>

            </h2>



            <p className="mt-4 text-sm leading-7 text-gray-400">Discover premium products with a smooth shopping experience, secure checkout, and fast delivery.</p>

          </div>



          {/* Shop */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-white">Shop</h3>



            <ul className="space-y-3 text-sm">

              <li>

                <Link to="/products" className="hover:text-emerald-400 transition">

                  All Products

                </Link>

              </li>



              <li>

                <Link to="/categories" className="hover:text-emerald-400 transition">

                  Categories

                </Link>

              </li>



              <li>

                <Link to="/new-arrivals" className="hover:text-emerald-400 transition">

                  New Arrivals

                </Link>

              </li>



              <li>

                <Link to="/offers" className="hover:text-emerald-400 transition">

                  Offers

                </Link>

              </li>

            </ul>

          </div>



          {/* Company */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>



            <ul className="space-y-3 text-sm">

              <li>

                <Link to="/about" className="hover:text-emerald-400 transition">

                  About Us

                </Link>

              </li>



              <li>

                <Link to="/privacy" className="hover:text-emerald-400 transition">

                  Privacy Policy

                </Link>

              </li>



              <li>

                <Link to="/terms" className="hover:text-emerald-400 transition">

                  Terms & Conditions

                </Link>

              </li>



              <li>

                <Link to="/faq" className="hover:text-emerald-400 transition">

                  FAQ

                </Link>

              </li>

            </ul>

          </div>



          {/* Newsletter */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-white">Newsletter</h3>



            <p className="text-sm text-gray-400 mb-5">Subscribe to receive the latest offers and updates.</p>



            <form className="flex flex-col gap-3">

              <input type="email" placeholder="Your email" className="rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 outline-none focus:border-emerald-400" />



              <button className="rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600">Subscribe</button>

            </form>

          </div>

        </div>



        {/* Bottom */}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-sm text-gray-500 md:flex-row">

          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>



          <div className="flex gap-6">

            <Link to="/privacy" className="hover:text-emerald-400 transition">

              Privacy

            </Link>



            <Link to="/terms" className="hover:text-emerald-400 transition">

              Terms

            </Link>



            <Link to="/support" className="hover:text-emerald-400 transition">

              Support

            </Link>

          </div>

        </div>

      </div>

    </footer>

  );}
