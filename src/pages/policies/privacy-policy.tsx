import Link from "next/link";
import React from "react";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { PolicyParagraph, SupportEmailLink } from "./cookies";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          <div className="flex items-center justify-center">
            <div className="mr-1">
              <UTellMeComponentButton />
            </div>
            <span>
              Privacy Policy
            </span>
          </div>
        </h1>
      </div>

      <h3>At&nbsp;<Link href={{
        pathname: '/'
      }} className="link link-hover">
        utellme
      </Link>&nbsp;one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by utellme and how we use it.</h3>

      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at&nbsp;<SupportEmailLink />.</p>

      <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in utellme. This policy is not applicable to any information collected offline or via channels other than this website.</p>

      <PolicyParagraph title="Consent">
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </PolicyParagraph>

      <PolicyParagraph title="The Information we Collect">
        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
        <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
        <p>When you register for an Account you will not be asked to enter personal information. We only allow signins with oauth or with email, so we will only collect your email address, not even a password.</p>
      </PolicyParagraph>

      <PolicyParagraph title="How we use your information" isList>
        <li>Provide, operate, and maintain our website</li>
        <li>Improve, personalize, and expand our website</li>
        <li>Understand and analyze how you use our website</li>
        <li>Develop new products, services, features, and functionality</li>
        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
        <li>Send you emails</li>
        <li>Find and prevent fraud</li>
      </PolicyParagraph>

      <PolicyParagraph title="Cookies and Web Beacons">
        <p>Like any other website, utellme uses &quot;cookies&quot; These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.</p>
        <p>To know more in depth how we use cookies visit our page&nbsp;
          <Link href={{
            pathname: '/policies/cookies'
          }} className="link link-hover">
            Cookie Notice
          </Link>
        </p>
      </PolicyParagraph>

      <PolicyParagraph title="Advertising Partners Privacy Policies">
        <p>You may consult this list to find the Privacy Policy for each of the advertising partners of utellme.</p>
        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on utellme, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
        <p>Note that utellme has no access to or control over these cookies that are used by third-party advertisers.</p>
      </PolicyParagraph>

      <PolicyParagraph title="Third Party Privacy Policies">
        <p>utellme&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. In particular, we use&nbsp;
          <Link href="https://support.google.com/adsense/answer/3394713" className="link link-hover">
            Google AdSense
          </Link>
          .
        </p>
      </PolicyParagraph>

      <PolicyParagraph title="CCPA Privacy Rights (Do Not Sell My Personal Information)">
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <p>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
        <p>Request that a business delete any personal data about the consumer that a business has collected.</p>
        <p>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</p>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
      </PolicyParagraph>

      <PolicyParagraph title="GDPR Data Protection Rights">
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
        <p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>
        <p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p>
        <p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
        <p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p>
        <p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
      </PolicyParagraph>


      <PolicyParagraph title="Children's Information">
        <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
        <p>utellme does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
      </PolicyParagraph>

    </div>
  );
}

export default PrivacyPolicy;
