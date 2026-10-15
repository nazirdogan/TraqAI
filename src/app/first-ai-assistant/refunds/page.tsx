import type { Metadata } from 'next';
import { FunnelFooter, FunnelHeader } from '../_components/ui';

export const metadata: Metadata = { title: 'Refunds and cancellations: Your First AI Assistant' };

export default function Page() {
  return (
    <div className="bg-bg-base">
      <FunnelHeader />
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-2xl space-y-5 text-[16px] leading-7 text-ink-soft">
          <h1 className="text-[32px] font-semibold text-ink">Refunds and cancellations</h1>
          <p>Plain and simple, so nobody is surprised.</p>
          <h2 className="pt-2 text-[20px] font-semibold text-ink">Live build and 1:1 setup</h2>
          <p>
            You can cancel for a full refund at any time before your live build or your 1:1 setup starts. Email hello@traqcollective.com from the address you
            paid with. At checkout you ask for the service to start on the date booked, and you confirm that the 14-day cancellation right ends once it has
            started. After it starts, it is not refundable, but if something on our side goes wrong we will put it right.
          </p>
          <p>If we have to move or cancel a session, you choose: a new date or a full refund.</p>
          <h2 className="pt-2 text-[20px] font-semibold text-ink">VIP Pass</h2>
          <p>
            You can cancel for a full refund until the free session it belongs to starts. The Starter Kit is digital content you get straight away, so once you
            have opened it the cancellation right ends, which checkout asks you to confirm.
          </p>
          <h2 className="pt-2 text-[20px] font-semibold text-ink">Claude Pro</h2>
          <p>Claude Pro is a subscription you hold with Anthropic, not with us. Cancel or change it in your Claude settings.</p>
          <h2 className="pt-2 text-[20px] font-semibold text-ink">Who we are</h2>
          <p>Traq Collective L.L.C-FZ, Meydan Free Zone, Dubai, United Arab Emirates. hello@traqcollective.com</p>
        </div>
      </section>
      <FunnelFooter />
    </div>
  );
}
