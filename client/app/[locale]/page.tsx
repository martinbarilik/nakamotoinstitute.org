import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

import { PageLayout } from "@/app/components/PageLayout";
import { locales } from "@/i18n";
import { getLatestMempoolPost } from "@/lib/api/mempool";
import { i18nTranslation } from "@/lib/i18n/i18nTranslation";
import { generateHrefLangs, getLocaleParams } from "@/lib/i18n/utils";
import { cdnUrl, urls } from "@/lib/urls";

const generateHref = (loc: Locale) => urls(loc).home;

export async function generateMetadata(): Promise<Metadata> {
  const languages = generateHrefLangs([...locales], generateHref);

  return {
    alternates: { languages },
  };
}

type HomeSectionProps = {
  title: string;
  button: AnchorProps;
  children: React.ReactNode;
};

const HomeSection = ({ title, button, children }: HomeSectionProps) => {
  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="mb-4 text-neutral-800">
        <h2 className="mb-2 mt-0 break-after-avoid text-3xl font-medium">
          {title}
        </h2>
        {children}
      </div>
      <div className="mt-auto text-neutral-800">
        <p className="mb-4 mt-0">
          <a
            className="inline-block cursor-pointer select-none rounded border border-solid border-blue-500 bg-blue-500 px-3 py-1 text-center align-middle text-base font-normal leading-normal text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:border-blue-600 focus:bg-blue-600 focus:text-white"
            href={button.href}
            role="button"
          >
            {button.text} »
          </a>
        </p>
      </div>
    </div>
  );
};

type BannerProps = {
  children: React.ReactNode;
};

const Banner = ({ children }: BannerProps) => {
  return (
    <div className="mb-4 rounded bg-amber-100 px-5 py-3 text-center text-yellow-800">
      {children}
    </div>
  );
};

export default async function HomePage({ params: { locale } }: LocaleParams) {
  const { t } = await i18nTranslation(locale);
  const latest = await getLatestMempoolPost(locale);

  return (
    <PageLayout locale={locale} generateHref={generateHref}>
      <div className="mb-8 rounded bg-gray-200 px-4 py-8 text-center">
        <Image
          className="mx-auto"
          src={cdnUrl("/img/blockchain.png")}
          width={480}
          height={240}
          alt="Blockchain"
          priority
        />
        <p className="mb-4 text-xl font-light italic">
          {t(
            "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party...",
          )}
        </p>
        <a
          className="inline-block cursor-pointer select-none rounded border border-solid border-green-600 bg-green-600 px-3 py-1 text-white hover:border-green-700 hover:bg-green-700 hover:text-white focus:border-green-700 focus:bg-green-700 focus:text-white"
          href={urls(locale).library.doc("bitcoin")}
          role="button"
        >
          {t("Read Satoshi's White Paper")}
        </a>
      </div>
      <p className="my-6 text-center text-3xl font-medium">
        <Trans
          i18nKey="Sign up for our <a>newsletter</a> to receive email updates."
          components={{
            a: <Link href={urls(locale).substack} />,
          }}
        />
      </p>
      <Banner>
        <Trans
          t={t}
          i18nKey="Check out the original code and website for Hal Finney's <a>Reusable Proofs of Work</a>"
          components={{
            a: <Link className="font-bold" href={urls(locale).finney.rpow} />,
          }}
        />
      </Banner>
      <Banner>
        <Trans
          t={t}
          i18nKey="Pay respect to visionary prognosticators at <a>The Skeptics: A Tribute to Bold Assertions</a>"
          components={{
            a: <Link className="font-bold" href={urls(locale).skeptics} />,
          }}
        />
      </Banner>
      <Banner>
        <Trans
          t={t}
          i18nKey="Read the <a>Crash Course in Bitcoin Political Economy</a>"
          components={{
            a: <Link className="font-bold" href={urls(locale).crashCourse} />,
          }}
        />
      </Banner>
      <div className="mt-6 flex text-left flex-col sm:flex-row">
        {latest ? (
          <HomeSection
            title={t("Mempool")}
            button={{
              text: "Read more",
              href: urls(locale).mempool.post(latest.slug),
            }}
          >
            <h3 className="italic">{latest.title}</h3>
            <p>{latest.excerpt}</p>
          </HomeSection>
        ) : null}
        <HomeSection
          title={t("Podcast")}
          button={{
            text: t("See episodes"),
            href: urls(locale).podcast.index,
          }}
        >
          <p>
            {t(
              "The Crypto-Mises Podcast offers commentary on Bitcoin, economics, cryptography, and current events.",
            )}
          </p>
        </HomeSection>
        <HomeSection
          title={t("Support")}
          button={{ text: t("Donate"), href: urls(locale).donate.index }}
        >
          <p>
            {t(
              "You can help us achieve our goals by donating today. Bitcoins only.",
            )}
          </p>
        </HomeSection>
      </div>
    </PageLayout>
  );
}

export function generateStaticParams() {
  return getLocaleParams();
}
