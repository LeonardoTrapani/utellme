import Link from "next/link";
import React from "react";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";

const CookiePolicy: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          <div className="flex items-center justify-center">
            <div className="mr-1">
              <UTellMeComponentButton />
            </div>
            <span>
              Cookie Notice
            </span>
          </div>
        </h1>
      </div>
      <PolicyParagraph title="What Are Cookies">
        As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or &apos;break&apos; certain elements of the sites functionality.
      </PolicyParagraph>

      <PolicyParagraph title="How We Use Cookies">
        We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
      </PolicyParagraph>

      <PolicyParagraph title="Cookie Settings">
        You can customize your cookie settings on the&nbsp;<Link href={{
          pathname: '/settings/privacy'
        }} className="link link-hover font-semibold">privacy settings</Link> by choosing between accepting all the cookies or only the necessary ones.
      </PolicyParagraph>

      <PolicyParagraph title="Disabling Cookies">
        You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of the this site. Therefore it is recommended that you do not disable cookies.
      </PolicyParagraph>

      <PolicyParagraph title="The Cookies We Set" isList>
        <li>
          <p className="font-semibold">Login related cookies</p>
          <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
        </li>
        <li>
          <p className="font-semibold">Account related cookies</p>
          <p>If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.</p>
        </li>
      </PolicyParagraph>

      <PolicyParagraph title="Third Party Cookies">
        In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
        <ul className="pl-4 list-disc">
          <li>
            <p>utellme uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</p>
            <p className="text-gray-500">For more information on Google Analytics cookies, see the official&nbsp;
              <Link href="https://analytics.google.com/" className="link link-hover">
                Google Analytics page
              </Link>
              .
            </p>
          </li>
          <li>
            <p>The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more relevant ads across the web and limit the number of times that a given ad is shown to you.</p>
            <p className="text-gray-500">For more information on Google AdSense see the official&nbsp;
              <Link href="https://support.google.com/adsense/answer/3394713" className="link link-hover">
                Google AdSense privacy FAQ
              </Link>
              .
            </p>
          </li>
        </ul>
      </PolicyParagraph>

      <PolicyParagraph title="More Information">
        Hopefully that has clarified things for you. As was previously mentioned if there is something that you aren&apos;t sure whether you need or not it is usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
      </PolicyParagraph>

      <p>If you are still looking for more information you can contact us at <SupportEmailLink /></p>
    </div >
  );
}

export const SupportEmailLink = () => {
  return (
    <a href="mailto:support@utellme.app" className="link">support@utellme.app</a>
  )
}

export const PolicyParagraph: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  isList?: boolean;
}> = (props) => {
  return (
    <div>
      <h3 className="font-semibold text-xl">{props.title}</h3>
      {
        props.isList ?
          <ul className="list-disc pl-4">
            {props.children}
          </ul>
          :
          <div>{props.children}</div>
      }
    </div>
  )
}
export default CookiePolicy;
