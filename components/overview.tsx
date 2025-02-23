import { motion } from 'framer-motion';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="w-full mx-auto md:mt-20 overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 leading-relaxed text-center max-w-full">
        <p className="text-3xl sm:text-4xl font-normal">
          <span className="font-bold">¿En qué puedo ayudar?</span>
        </p>
      </div>
    </motion.div>
  );
};
