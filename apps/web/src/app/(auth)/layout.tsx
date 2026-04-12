export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-xl">🌿</div>
          <span className="font-heading font-bold text-2xl">Agro Hub</span>
        </div>

        <div>
          <h2 className="text-4xl font-heading font-bold leading-tight">
            Trade Agriculture,
            <br />
            <span className="text-brand-orange-400">Feed the World</span>
          </h2>
          <p className="text-white/70 mt-4 text-lg max-w-md">
            The global marketplace for cash crops, food crops, livestock, fisheries, coffee, and more.
            B2B bulk orders and B2C retail — any currency, worldwide shipping.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: '🌾', label: '50+ crop types' },
              { icon: '🌍', label: 'Available worldwide' },
              { icon: '🔒', label: 'Escrow protected' },
              { icon: '💳', label: 'PayPal, card & more' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Agro Hub. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
