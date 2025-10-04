import { GithubIcon } from "@/components/SvgIcons";

type ContactModalProps = {
  modalId: string;
};

function ContactModal({ modalId }: ContactModalProps) {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box text-left">
        <h2 className="text-xl border-b border-neutral-300 mb-2">連絡先</h2>
        <p className="mb-4">
          <a
            href="https://x.com/1m_lcei"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            @1m_lcei
          </a>
        </p>
        <h2 className="text-xl border-b border-neutral-300 mb-2">画像</h2>
        <ul className="list-disc list-inside mb-4">
          <li>「ブルーアーカイブ」ファンキット</li>
          <li>@himeno_Q</li>
          <li>OpenMoji (CC-BY-SA-4.0)</li>
          <li>SVG Logos (CC0 1.0 Universal)</li>
        </ul>
        <div className="divider" />
        <p>🎨 本Webサイトは、「ブルーアーカイブ」非公式二次創作です。</p>
        <div className="flex flex-col items-end m-2">
          <a
            href="https://github.com/1m-lcei/kuto-nanidasu"
            target="_blank"
            rel="noopener"
          >
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        {/** biome-ignore lint/a11y/useButtonType: 適切 */}
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ContactModal;
