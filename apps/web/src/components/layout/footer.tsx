import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  Marketplace: [
    { href: '/products',    label: 'All Products' },
    { href: '/cash-crops',  label: 'Cash Crops' },
    { href: '/food-crops',  label: 'Food Crops' },
    { href: '/livestock',   label: 'Livestock' },
    { href: '/fisheries',   label: 'Fisheries' },
    { href: '/coffee',      label: 'Coffee & Beverages' },
  ],
  Sectors: [
    { href: '/sector/vegetables',      label: 'Vegetables' },
    { href: '/sector/fruits',          label: 'Fruits' },
    { href: '/sector/spices_herbs',    label: 'Spices & Herbs' },
    { href: '/sector/farm_inputs',     label: 'Farm Inputs' },
    { href: '/sector/seeds_nursery',   label: 'Seeds & Nursery' },
    { href: '/sector/agro_processing', label: 'Agro-Processing' },
  ],
  Company: [
    { href: '/about',   label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog',    label: 'Blog' },
    { href: '/careers', label: 'Careers' },
  ],
  Support: [
    { href: '/help',    label: 'Help Center' },
    { href: '/shipping',label: 'Shipping Info' },
    { href: '/disputes',label: 'Disputes' },
    { href: '/terms',   label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-4">
              <Image
                src="/images/agro-hub-logo.png"
                alt="Agro Hub"
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The global agricultural marketplace. Buy and sell crops, livestock, fish, coffee,
              medicines, seeds and more — from anywhere in the world.
            </p>
            <div className="flex gap-3 mt-4 text-xl">
              <span title="Accepts all currencies">💱</span>
              <span title="Global shipping">🚢</span>
              <span title="Escrow protection">🔒</span>
              <span title="Verified suppliers">✅</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/agro-hub-logo.png"
              alt="Agro Hub"
              width={80}
              height={24}
              className="h-6 w-auto object-contain opacity-60"
            />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Agro Hub. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap justify-center">
            <span>🌍 Available Worldwide</span>
            <span>•</span>
            <span>💳 PayPal · Card · Mobile Money · Bank Transfer</span>
            <span>•</span>
            <span>🔒 Escrow Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
