import { motion } from 'framer-motion'
import Panel from '../../ui/Panel.jsx'
import TextInput from '../../ui/TextInput.jsx'
import Button from '../../ui/Button.jsx'

export default function AdminLoginPanel({
  usernameInput,
  passwordInput,
  onUsernameChange,
  onPasswordChange,
  onConnect,
  showError,
}) {
  return (
    <Panel className="w-full max-w-[400px] border-border-light/50 bg-surface/80 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-5">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary ml-1">Username</label>
            <TextInput
              id="admin-user"
              value={usernameInput}
              onChange={onUsernameChange}
              className="bg-black/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary ml-1">Password</label>
            <TextInput
              id="admin-pass"
              type="password"
              value={passwordInput}
              onChange={onPasswordChange}
              className="bg-black/20"
            />
          </div>
        </div>

        <Button className="w-full justify-center" onClick={onConnect}>
          LOGIN
        </Button>

        {showError ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-sm border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-200"
          >
            Pristup odbijen. Proverite podatke.
          </motion.div>
        ) : null}
      </div>
    </Panel>
  )
}
